# Coppies and builds prereqs for website from other repos

MV=mv -f
CP=cp -r

all: rastjs terra algs
	@echo "Build Completed"

rastjs:
	$(RM) -r assets/webdemos/engine
	$(CP) ../rastjs/engine assets/webdemos/engine

terra:
	$(MAKE) -C ../terra
	$(RM) -r assets/webdemos/terra
	$(CP) ../terra/out assets/webdemos/terra

algs:
	$(MAKE) -C ../webalgs

